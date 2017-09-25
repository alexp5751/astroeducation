<?php

namespace AstroEducation\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table(name="users")
 * @ORM\Entity
 */
class User
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", precision=0, scale=0, nullable=false, unique=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="username", type="string", precision=0, scale=0, nullable=false, unique=true)
     */
    private $username;

    /**
     * @var string
     *
     * @ORM\Column(name="passwordHash", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $passwordHash;

    /**
     * @var string
     *
     * @ORM\Column(name="passwordSalt", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $passwordSalt;

    /**
     * @var string
     *
     * @ORM\Column(name="token", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $token;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="expiration", type="datetime", precision=0, scale=0, nullable=false, unique=false)
     */
    private $expiration;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="AstroEducation\Entities\Score", mappedBy="users")
     */
    private $scores;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->scores = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string 
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set passwordHash
     *
     * @param string $passwordHash
     * @return User
     */
    public function setPasswordHash($passwordHash)
    {
        $this->passwordHash = $passwordHash;

        return $this;
    }

    /**
     * Get passwordHash
     *
     * @return string 
     */
    public function getPasswordHash()
    {
        return $this->passwordHash;
    }

    /**
     * Set passwordSalt
     *
     * @param string $passwordSalt
     * @return User
     */
    public function setPasswordSalt($passwordSalt)
    {
        $this->passwordSalt = $passwordSalt;

        return $this;
    }

    /**
     * Get passwordSalt
     *
     * @return string 
     */
    public function getPasswordSalt()
    {
        return $this->passwordSalt;
    }

    /**
     * Set token
     *
     * @param string $token
     * @return User
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string 
     */
    public function getToken()
    {
        return $this->token;
    }

    /**
     * Set expiration
     *
     * @param \DateTime $expiration
     * @return User
     */
    public function setExpiration($expiration)
    {
        $this->expiration = $expiration;

        return $this;
    }

    /**
     * Get expiration
     *
     * @return \DateTime 
     */
    public function getExpiration()
    {
        return $this->expiration;
    }

    /**
     * Add scores
     *
     * @param \AstroEducation\Entities\Score $scores
     * @return User
     */
    public function addScore(\AstroEducation\Entities\Score $scores)
    {
        $this->scores[] = $scores;

        return $this;
    }

    /**
     * Remove scores
     *
     * @param \AstroEducation\Entities\Score $scores
     */
    public function removeScore(\AstroEducation\Entities\Score $scores)
    {
        $this->scores->removeElement($scores);
    }

    /**
     * Get scores
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getScores()
    {
        return $this->scores;
    }
}
