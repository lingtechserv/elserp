<?php

namespace App\Imports;

use App\Models\InventoryItem;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class InventoryImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new InventoryItem([
            'sku' => $row['sku'],
            'name' => $row['name'],
            'type' => $row['type'],
            'category' => $row['category'],
            'subcat' => $row['subcat'],
            'active' => $row['active'],
        ]);
    }
}
