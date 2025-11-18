<?php
	define('PREPEND_PATH', '');
	include_once(__DIR__ . '/lib.php');

	// accept a record as an assoc array, return transformed row ready to insert to table
	$transformFunctions = [
		'circle_members' => function($data, $options = []) {
			if(isset($data['added_at'])) $data['added_at'] = guessMySQLDateTime($data['added_at']);

			return $data;
		},
		'circles' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'followers' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'friends' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'messages' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'password_resets' => function($data, $options = []) {
			if(isset($data['requested_at'])) $data['requested_at'] = guessMySQLDateTime($data['requested_at']);

			return $data;
		},
		'post_comments' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'post_likes' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'post_saves' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'post_shares' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'posts' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
		'users' => function($data, $options = []) {
			if(isset($data['created_at'])) $data['created_at'] = guessMySQLDateTime($data['created_at']);

			return $data;
		},
	];

	// accept a record as an assoc array, return a boolean indicating whether to import or skip record
	$filterFunctions = [
		'circle_members' => function($data, $options = []) { return true; },
		'circles' => function($data, $options = []) { return true; },
		'followers' => function($data, $options = []) { return true; },
		'friends' => function($data, $options = []) { return true; },
		'messages' => function($data, $options = []) { return true; },
		'password_resets' => function($data, $options = []) { return true; },
		'post_comments' => function($data, $options = []) { return true; },
		'post_likes' => function($data, $options = []) { return true; },
		'post_saves' => function($data, $options = []) { return true; },
		'post_shares' => function($data, $options = []) { return true; },
		'posts' => function($data, $options = []) { return true; },
		'users' => function($data, $options = []) { return true; },
	];

	/*
	Hook file for overwriting/amending $transformFunctions and $filterFunctions:
	hooks/import-csv.php
	If found, it's included below

	The way this works is by either completely overwriting any of the above 2 arrays,
	or, more commonly, overwriting a single function, for example:
		$transformFunctions['tablename'] = function($data, $options = []) {
			// new definition here
			// then you must return transformed data
			return $data;
		};

	Another scenario is transforming a specific field and leaving other fields to the default
	transformation. One possible way of doing this is to store the original transformation function
	in GLOBALS array, calling it inside the custom transformation function, then modifying the
	specific field:
		$GLOBALS['originalTransformationFunction'] = $transformFunctions['tablename'];
		$transformFunctions['tablename'] = function($data, $options = []) {
			$data = call_user_func_array($GLOBALS['originalTransformationFunction'], [$data, $options]);
			$data['fieldname'] = 'transformed value';
			return $data;
		};
	*/

	@include(__DIR__ . '/hooks/import-csv.php');

	$ui = new CSVImportUI($transformFunctions, $filterFunctions);
