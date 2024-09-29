<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class InventoryIndexJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    public function __construct(Authenticatable $user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        $allInventory = [];

        $inventoryTypes = [
            'rawmaterial' => 'read-rawmaterial',
            'bulkeliquid' => 'read-bulkeliquid',
            'flavourconcentrate' => 'read-flavourconcentrate',
            'hardware' => 'read-hardware',
            'product' => 'read-product',
        ];

        foreach ($inventoryTypes as $type => $permission) {
            if ($this->user->can($permission)) {
                $model = $this->getModelForType($type);
                $items = $model::with(['costs', 'options', 'locations', 'suppliers'])->get();
                $allInventory[$type] = $this->formatInventory($items, $type);
            }
        }

        return $allInventory;
    }

    private function getModelForType($type)
    {
        switch ($type) {
            case 'rawmaterial':
                return \App\Models\RawMaterial::class;
            case 'bulkeliquid':
                return \App\Models\BulkELiquid::class;
            case 'flavourconcentrate':
                return \App\Models\FlavourConcentrate::class;
            case 'hardware':
                return \App\Models\Hardware::class;
            case 'product':
                return \App\Models\Product::class;
            default:
                return null;
        }
    }
    private function formatInventory($items, $type)
{
    return $items->mapWithKeys(function ($item) use ($type) {
        $quantityTotal = $item->locations->sum('quantity');
        $preferredSupplier = $item->suppliers->firstWhere('preferred', true);

        $suppliersData = $item->suppliers->map(function ($supplier) {
            return [
                'name' => $supplier->name,
                'preferred' => $supplier->preferred,
                'lead' => $supplier->lead_time
            ];
        });

        $costsData = $item->costs->map(function ($cost) {
            return [
                'cost' => $cost->cost,
                'unit' => $cost->unit,
                'type' => $cost->type
            ];
        });

        $item->load('options.children');

        $optionsData = $item->options->mapWithKeys(function ($option) use ($item) {
            $value = $option->pivot->value ?? null;

            $choices = $option->children->map(function ($child) {
                return ['id' => $child->id, 'option' => $child->option];
            });

            return [
                $option->option => [
                    'value' => $value,
                    'choices' => $choices
                ]
            ];
        });

        $locationDetails = $this->getFormattedLocationDetails($item, $type);

        $detailsData = collect($item->getAttributes())->except(['id', 'name', 'sku', 'created_at', 'updated_at']);

        return [
            $item->sku => [
                'id' => $item->id,
                'basics' => [
                    'name' => $item->name,
                    'type' => $type,
                    'sku' => $item->sku,
                    'quantity_total' => $quantityTotal,
                    'supplier' => $preferredSupplier ? $preferredSupplier->supplier->name : null,
                    'lead' => $preferredSupplier ? $preferredSupplier->lead_time : null
                ],
                'suppliers' => $suppliersData->all(),
                'costs' => $costsData->all(),
                'details' => $detailsData->all(),
                'options' => $optionsData->all(),
                'locations' => $locationDetails
            ]
        ];
    });
}
}