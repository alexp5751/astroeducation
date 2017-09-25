<?php
namespace AstroEducation\Entities;

use Doctrine\Common\Collections\ArrayCollection;

/**
 * @Entity @Table(name="assessments")
 **/
class Assessment
{
    /**
     * @var int
     * @Id @Column(type="integer") @GeneratedValue
     */
    protected $id;
    /**
     * @var string
     * @Column(type="string")
     */
    protected $name;
    /**
     * @var int
     * @Column(type="string")
     */
    protected $maxScore;
    /**
     * @var int
     * @Column(type="string")
     */
    protected $minScore;

    /**
     * @var array
     * @OneToMany(targetEntity="Score", mappedBy="assessments")
     */
    protected $scores;

    public function __construct() {
      $this->scores = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getMaxScore()
    {
        return $this->maxScore;
    }

    public function getMinScore()
    {
        return $this->minScore;
    }

    public function setMaxScore($maxScore)
    {
        $this->maxScore = $maxScore;
    }

    public function setMinScore($minScore)
    {
        $this->minScore = $minScore;
    }
}
