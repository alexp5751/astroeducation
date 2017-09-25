<?php
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

$devMode = true;
$config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/config"), $devMode);
$connection = [
    'driver' => "pdo_mysql",
    'dbname' => "astroeducation",
    'host' => 'mysql',
    'user' => 'root',
    'password' => ''
];
$entityManager = EntityManager::create($connection, $config);
