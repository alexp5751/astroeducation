<?php

namespace AstroEducation\Entities;

use Doctrine\ORM\Mapping as ORM;

/**
 * Score
 *
 * @ORM\Table(name="scores")
 * @ORM\Entity
 */
class Score
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
     * @var integer
     *
     * @ORM\Column(name="firstScore", type="integer", precision=0, scale=0, nullable=false, unique=false)
     */
    private $firstScore;

    /**
     * @var integer
     *
     * @ORM\Column(name="maxScore", type="integer", precision=0, scale=0, nullable=false, unique=false)
     */
    private $maxScore;

    /**
     * @var \AstroEducation\Entities\User
     *
     * @ORM\ManyToOne(targetEntity="AstroEducation\Entities\User", inversedBy="scores")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $user;

    /**
     * @var \AstroEducation\Entities\Assessment
     *
     * @ORM\ManyToOne(targetEntity="AstroEducation\Entities\Assessment", inversedBy="scores")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="assessment_id", referencedColumnName="id")
     * })
     */
    private $assessment;


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
     * Set firstScore
     *
     * @param integer $firstScore
     * @return Score
     */
    public function setFirstScore($firstScore)
    {
        $this->firstScore = $firstScore;

        return $this;
    }

    /**
     * Get firstScore
     *
     * @return integer 
     */
    public function getFirstScore()
    {
        return $this->firstScore;
    }

    /**
     * Set maxScore
     *
     * @param integer $maxScore
     * @return Score
     */
    public function setMaxScore($maxScore)
    {
        $this->maxScore = $maxScore;

        return $this;
    }

    /**
     * Get maxScore
     *
     * @return integer 
     */
    public function getMaxScore()
    {
        return $this->maxScore;
    }

    /**
     * Set user
     *
     * @param \AstroEducation\Entities\User $user
     * @return Score
     */
    public function setUser(\AstroEducation\Entities\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \AstroEducation\Entities\User 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set assessment
     *
     * @param \AstroEducation\Entities\Assessment $assessment
     * @return Score
     */
    public function setAssessment(\AstroEducation\Entities\Assessment $assessment = null)
    {
        $this->assessment = $assessment;

        return $this;
    }

    /**
     * Get assessment
     *
     * @return \AstroEducation\Entities\Assessment 
     */
    public function getAssessment()
    {
        return $this->assessment;
    }
}
