<?php
namespace AstroEducation;

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use AstroEducation\Entities\User;
use AstroEducation\Entities\Score;
use AstroEducation\Entities\Assessment;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

require 'vendor/autoload.php';

date_default_timezone_set('UTC');

$config = [
    "db" => [
    "host" => 'localhost',
    "user" => 'astroeducation',
    "pass" => ''
    ]
];

$app = new \Slim\App(["settings" => $config]);
$container = $app->getContainer();

$container['db'] = function ($c) {

    $devMode = false;
    $config = Setup::createAnnotationMetadataConfiguration(array(__DIR__."/config"), $devMode, null, null, false);
    $connection = [
        'driver' => "pdo_mysql",
        'dbname' => "astroeducation",
        'host' => 'mysql',
        'user' => 'root',
        'password' => ''
    ];
    return EntityManager::create($connection, $config);
};

$app->post('/user/login', function (Request $request, Response $response) {
    $token = uniqid();
    $responseData = [
        "user_token" => $token
    ];

    $username = $request->getParam('username');
    if (!$username) {
        return $response->withStatus(400);
    }
    $password = $request->getParam('password');
    if (!$password) {
        return $response->withStatus(400);
    }

    $query = array('username' => $username);
    $user = $this->db
        ->getRepository('AstroEducation\Entities\User')
        ->findOneBy($query);
    if ($user && password_verify($password, $user->getPasswordHash())) {
        $now = new \DateTime(); //current date/time
        $now->add(new \DateInterval("PT1H"));

        $user->setToken($token);
        $user->setExpiration($now);
        $entityManager = $this->db;
        $entityManager->persist($user);
        $entityManager->flush();

        return $response->withJson($responseData);
    }
    return $response->withStatus(401);
});

$app->post('/user/create', function (Request $request, Response $response) {
    $id = uniqid();

    $username = $request->getParam('username');
    if (!$username) {
        return $response->withStatus(400);
    }

    $password = $request->getParam('password');
    if (!$password) {
        return $response->withStatus(400);
    }

    $query = array('username' => $username);
    $user = $this->db
        ->getRepository('AstroEducation\Entities\User')
        ->findOneBy($query);
    if ($user) {
        $duplicateUser = [
            "error" => "This user already exists"
        ];
        return $response->withStatus(409)->withJson($duplicateUser);
    }

    $now = new \DateTime(); //current date/time
    $now->add(new \DateInterval("PT1H"));
    $token = uniqid();

    $newUser = new User();
    $newUser->setUsername($username);
    $newUser->setPasswordHash(password_hash($password, PASSWORD_DEFAULT));
    $newUser->setPasswordSalt(md5(rand()));
    $newUser->setToken($token);
    $newUser->setExpiration($now);
    $entityManager = $this->db;
    $entityManager->persist($newUser);
    $entityManager->flush();

    $responseData = [
        "user_token" => $id
    ];
    return $response->withJson($responseData);
});

$app->post('/user/{username}/score/{assessment_name}', function (Request $request, Response $response) {
	$username = $request->getAttribute('username');
	$assessmentName = $request->getAttribute('assessment_name');
    $scoreValue = $request->getParam('score');

    $query = array('username' => $username);
    $user = $this->db
        ->getRepository('AstroEducation\Entities\User')
        ->findOneBy($query);
    if ($user == null) {
        return $response->withStatus(400)->withJson("no_user"); //error
    }

    if ($request->getHeader("Auth")[0] != $user->getToken()) {
        return $response->withStatus(401);
    }

    $entityManager = $this->db;
    $query = array('name' => $assessmentName);
    $assessment = $this->db
        ->getRepository('AstroEducation\Entities\Assessment')
        ->findOneBy($query);
    if ($assessment == null) {
        $assessment = new Assessment();
        $assessment->setName($assessmentName);
        $assessment->setMaxScore(100);
        $assessment->setMinScore(0);
        $entityManager->persist($assessment);
    }

    $query = array('user' => $user, 'assessment' => $assessment);
    $score = $this->db
        ->getRepository('AstroEducation\Entities\Score')
        ->findOneBy($query);
    if ($score == null) {
        $score = new Score();
        $score->setUser($user);
        $score->setAssessment($assessment);
        $score->setFirstScore($scoreValue);
        $score->setMaxScore($scoreValue);
    } else {
        $score->setMaxScore(max($scoreValue, $score->getMaxScore()));
    }
    $entityManager->persist($score);
    $entityManager->flush();

    return $response;
});

$app->get('/user/{username}/score/{assessment_name}', function (Request $request, Response $response) {
    $username = $request->getAttribute('username');
    $assessmentName = $request->getAttribute('assessment_name');

    $query = array('username' => $username);
    $user = $this->db
        ->getRepository('AstroEducation\Entities\User')
        ->findOneBy($query);
    if ($user == null) {
        return $response->withStatus(400)->withJson("no_user"); //error
    }

    if ($request->getHeader("Auth")[0] != $user->getToken()) {
        return $response->withStatus(401);
    }

    $query = array('name' => $assessmentName);
    $assessment = $this->db
        ->getRepository('AstroEducation\Entities\Assessment')
        ->findOneBy($query);
    if ($assessment == null) {
        $response->withStatus(400)->withJson("no_assessment");
    }

    $query = array('user' => $user, 'assessment' => $assessment);
    $score = $this->db
        ->getRepository('AstroEducation\Entities\Score')
        ->findOneBy($query);
    if ($score == null) {
        return $response->withStatus(404);
    }

    $responseData = [
        "first_score" => $score->getFirstScore(),
        "max_score" => $score->getMaxScore()
    ];

    return $response->withJson($responseData);
});

$app->run();
