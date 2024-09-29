<?php

return [

    'fetch' => PDO::FETCH_CLASS,

    'default' => env('DB_CONNECTION', 'mysql'),

    'connections' => [

        'sqlite' => [
            'driver'   => 'sqlite',
            'database' => database_path('database.sqlite'), // Use `database_path()` helper function instead of manually defining path.
            'prefix'   => '',
        ],

        'mysql' => [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST', '127.0.0.1'),  // Replace hardcoded values with environment variables for flexibility.
            'database'  => env('DB_DATABASE', 'redux'),
            'username'  => env('DB_USERNAME', 'backend'),
            'password'  => env('DB_PASSWORD', 'lts6219'),
            'charset'   => 'utf8mb4',  // Use 'utf8mb4' for full UTF-8 support (including emojis).
            'collation' => 'utf8mb4_unicode_ci',
            'prefix'    => '',
        ],

        'mysql_live' => [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST_LIVE', 'live-database-hostname'),
            'database'  => env('DB_DATABASE_LIVE', 'redux'),
            'username'  => env('DB_USERNAME_LIVE', 'backend'),
            'password'  => env('DB_PASSWORD_LIVE', 'lts6219'),
            'charset'   => 'utf8mb4',  // Use 'utf8mb4' for live database as well.
            'collation' => 'utf8mb4_unicode_ci',
            'prefix'    => '',
        ],

        'pgsql' => [
            'driver'   => 'pgsql',
            'host'     => env('DB_HOST_PGSQL', 'localhost'),
            'database' => env('DB_DATABASE_PGSQL', 'forge'),
            'username' => env('DB_USERNAME_PGSQL', 'forge'),
            'password' => env('DB_PASSWORD_PGSQL', ''),
            'charset'  => 'utf8',
            'prefix'   => '',
            'schema'   => 'public',
        ],

        'sqlsrv' => [
            'driver'   => 'sqlsrv',
            'host'     => env('DB_HOST_SQLSRV', 'localhost'),
            'database' => env('DB_DATABASE_SQLSRV', 'database'),
            'username' => env('DB_USERNAME_SQLSRV', 'root'),
            'password' => env('DB_PASSWORD_SQLSRV', ''),
            'prefix'   => '',
        ],

    ],

    'migrations' => 'migrations',

    'redis' => [

        'cluster' => false,

        'default' => [
            'host'     => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port'     => env('REDIS_PORT', 6379),
            'database' => 0,
        ],

    ],

];
