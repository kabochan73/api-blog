<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        env('FRONTEND_URL', ''),
        'https://api-blog-navy.vercel.app',
    ],
    'allowed_origins_patterns' => [
        '#^https://api-blog-.*\.vercel\.app$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
