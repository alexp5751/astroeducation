<?php

namespace AstroEducation\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * Assessment
 *
 * @ORM\Table(name="assessments")
 * @ORM\Entity
 */
class Assessment
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
     * @ORM\Column(name="name", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="maxScore", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $maxScore;

    /**
     * @var string
     *
     * @ORM\Column(name="minScore", type="string", precision=0, scale=0, nullable=false, unique=false)
     */
    private $minScore;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\OneToMany(targetEntity="AstroEducation\Entities\Score", mappedBy="assessments")
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
     * Set name
     *
     * @param string $name
     * @return Assessment
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set maxScore
     *
     * @param string $maxScore
     * @return Assessment
     */
    public function setMaxScore($maxScore)
    {
        $this->maxScore = $maxScore;

        return $this;
    }

    /**
     * Get maxScore
     *
     * @return string 
     */
    public function getMaxScore()
    {
        return $this->maxScore;
    }

    /**
     * Set minScore
     *
     * @param string $minScore
     * @return Assessment
     */
    public function setMinScore($minScore)
    {
        $this->minScore = $minScore;

        return $this;
    }

    /**
     * Get minScore
     *
     * @return string 
     */
    public function getMinScore()
    {
        return $this->minScore;
    }

    /**
     * Add scores
     *
     * @param \AstroEducation\Entities\Score $scores
     * @return Assessment
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
