<?php
namespace AstroEducation\Entities;

/**
 * @Entity @Table(name="scores")
 **/
class Score
{
    /**
     * @var int
     * @Id @Column(type="integer") @GeneratedValue
     */
    protected $id;
    /**
     * @ManyToOne(targetEntity="User", inversedBy="scores")
     */
    protected $user;
    /**
     * @ManyToOne(targetEntity="Assessment", inversedBy="scores")
     */
    protected $assessment;
    /**
     * @var int
     * @Column(type="integer")
     */
    protected $firstScore;
    /**
     * @var int
     * @Column(type="integer")
     */
    protected $maxScore;

    public function getId()
    {
        return $this->id;
    }

    public function getFirstScore() {
        return $this->firstScore;
    }

    public function setFirstScore($score) {
        $this->firstScore = $score;
    }

    public function getMaxScore() {
        return $this->maxScore;
    }

    public function setMaxScore($score) {
        $this->maxScore = $score;
    }
}
