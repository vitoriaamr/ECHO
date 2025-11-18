<?php
include(__DIR__ . '/lib.php');

// json output header
header('Content-Type: application/json');

$manifest = [
	'name' => APP_TITLE . ' by AppGini Free Edition',
	'short_name' => substr(APP_TITLE, 0, 12),
	'start_url' => './index.php',
	'display' => 'standalone',
	'background_color' => '#ffffff',
	'theme_color' => '#000000',
	'icons' => [
		[
			'src' => './resources/images/app-icon-72.png',
			'sizes' => '72x72',
			'type' => 'image/png'
		],
		[
			'src' => './resources/images/app-icon-96.png',
			'sizes' => '96x96',
			'type' => 'image/png'
		],
		[
			'src' => './resources/images/app-icon-144.png',
			'sizes' => '144x144',
			'type' => 'image/png'
		],
		[
			'src' => './resources/images/app-icon-192.png',
			'sizes' => '192x192',
			'type' => 'image/png'
		],
		[
			'src' => './resources/images/app-icon-384.png',
			'sizes' => '384x384',
			'type' => 'image/png'
		],
		[
			'src' => './resources/images/app-icon-512.png',
			'sizes' => '512x512',
			'type' => 'image/png'
		]
	]
];

echo json_encode($manifest, JSON_PARTIAL_OUTPUT_ON_ERROR);
