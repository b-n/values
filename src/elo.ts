type ELORank = number

export enum EloOutcome {
  DRAW = 0.5,
  CHALLENGER = 1,
  OPPONENT = 0,
}

const getKFactor = (rank: ELORank): number => {
  if (rank < 2100) return 32
  if (rank < 2400) return 24
  return 16
}

const calculateNewRatings = (challenger: ELORank, opponent: ELORank, outcome: EloOutcome): [ELORank, ELORank] => {
  const probabiltyOfWin =
    1 / (
      1 + Math.pow(
        10,
        (opponent - challenger) / 400
      )
    )

  return [
    challenger + (getKFactor(challenger) * (outcome - probabiltyOfWin)),
    opponent + (getKFactor(opponent) * ((1 - outcome) - (1 - probabiltyOfWin))),
  ]
}

export {
  calculateNewRatings,
}
