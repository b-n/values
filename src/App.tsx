import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import {
  Avatar,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import valuesList from'./values.json'

import { EloOutcome, calculateNewRatings } from './elo'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  indicator: {
    margin: '2em 1em 2em 0em',
  },
  card: {
    textAlign: 'center',
    display: 'flex',
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
  option: {
    height: 120,
    backgroundColor: theme.palette.primary.main,
    color: 'black',
  },
}))

interface ValueProps {
  outcome: EloOutcome
  className?: string
  onClick: (outcome: EloOutcome) => void
  children: React.ReactNode
}

const Value: React.FC<ValueProps> = ({ outcome, className, onClick, children }) => {
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${className || ''}`}>
      <CardActionArea onClick={() => onClick(outcome)}>
        <CardContent>
          {children}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const maxMatches = 5;

const getNewPlayers = (values: Array<Val>): [string, string] => {
  const dataSet = values.filter(value => value.matches < maxMatches);
  if (dataSet.length <= 0) return ['',''];
  const size = dataSet.length - 1;
  const numbers = [ _.random(0, size, false), _.random(0, size, false) ];
  while (numbers[0] === numbers[1]) {
    numbers[1] = _.random();
  }
  return [dataSet[numbers[0]].name, dataSet[numbers[1]].name]
}

interface Val {
  name: string
  score: number
  matches: number
}

const App = () => {
  const classes = useStyles();
  const [ isCollecting, setIsCollecting ] = useState(true);
  const [ values, setValues ] = useState<Array<Val>>(valuesList.map(name => ({ name, score: 1000, matches: 0 })));

  const [ players, setPlayers ] = useState(['', '']);

  useEffect(() => {
    setPlayers(getNewPlayers(values));
  }, [])

  useEffect(() => {
  }, [ values ]);

  const handleClick = (outcome: EloOutcome) => {
    const value1 = values.find(({ name }) => name === players[0]);
    const value2 = values.find(({ name }) => name === players[1]);
    const [ rating1, rating2 ] = calculateNewRatings(value1!.score, value2!.score, outcome);
    const newValues = values.slice().map(value => {
      if (value.name === value1!.name) {
        value.score = rating1;
        value.matches++;
      }
      if (value.name === value2!.name) {
        value.score = rating2;
        value.matches++;
      }
      return value;
    });

    newValues.sort((a, b) => b.score - a.score);
    setValues(newValues);
    const newPlayers = getNewPlayers(values);
    if (newPlayers[0] === '') {
      setIsCollecting(false);
      return;
    }
    setPlayers(newPlayers);
  }

  return (
    <Container maxWidth="md">
      {
        isCollecting && 
        <Grid container justify="center" spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Value outcome={EloOutcome.CHALLENGER} onClick={handleClick} className={classes.option}>
              <Typography variant="h4">{players[0]}</Typography>
            </Value>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Value outcome={EloOutcome.OPPONENT} onClick={handleClick} className={classes.option}>
              <Typography variant="h4">{players[1]}</Typography>
            </Value>
          </Grid>
          <Grid item xs={12}>
            <Value outcome={EloOutcome.DRAW} onClick={handleClick}>
              <Typography variant="h6">Draw</Typography>
            </Value>
          </Grid>
        </Grid>
      }
      <Chip
        className={classes.indicator}
        label="no matches"
        color='secondary'
        avatar={<Avatar>{values.filter(v => v.matches === 0).length}</Avatar>}
      />
      <Chip
        className={classes.indicator}
        label="completed"
        color='secondary'
        avatar={<Avatar>{values.filter(v => v.matches === maxMatches).length}</Avatar>}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Matches</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map(value => ( 
            <TableRow key={value.name}>
              <TableCell>{value.name}</TableCell>
              <TableCell align="right">{_.round(value.score - 1000)}</TableCell>
              <TableCell align="right">{value.matches}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
