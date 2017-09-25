<?php
namespace AstroEducation\Entities;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * @Entity @Table(name="users")
 **/
class User
{
    /**
     * @var int
     * @Id @Column(type="integer") @GeneratedValue
     */
    protected $id;
    /**
     * @var string
     * @Column(type="string", unique=true)
     */
    protected $username;
    /**
     * @var string
     * @Column(type="string")
     */
    protected $passwordHash;
    /**
     * @var string
     * @Column(type="string")
     */
    protected $passwordSalt;
    /**
     * @var string
     * @Column(type="string")
     */
    protected $token;
    /**
     * @var string
     * @Column(type="datetime")
     */
    protected $expiration;
    /**
     * @var array
     * @OneToMany(targetEntity="Score", mappedBy="users")
     */
    protected $scores;

    public function getId()
    {
        return $this->id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($name)
    {
        $this->name = $username;
    }
}
