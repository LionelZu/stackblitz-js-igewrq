const data =
  'Cardiff West, 11014, C, 17803, L, 4923, UKIP, 2069, LD\nOther Cir, 20, C, 17803, L, 4923, UKIP, 2069, LD';

try {
  processDatas(data);
} catch (error) {
  console.error('An error caught in a result of voting');
  console.error(error);
} finally {
  console.info('Finally will execute the good entries');
}

/**
 * Process all results.
 * @param data: data cvs content
 */
function processDatas(data) {
  data.split('\n').forEach((dataLine) => {
    processLine(dataLine);
  });
}

/**
 * Process a line of results.
 * @param line a line of csv.
 */
function processLine(line) {
  const { circonscription, results } = parseVotes(line);

  const totalVotes = results.reduce((acc, curr) => acc + curr.votes, 0);
  results.forEach((r) => r.computePercent(totalVotes));

  results.sort((a, b) => b.votes - a.votes);
  printResults(circonscription, results);
}

/**
 * Show the results in console log
 */
function printResults(circonscription, results) {
  console.info(`Résultat ${circonscription}`);
  console.table(results.map((r) => r.toResult()));
}

/**
 * Parse the CSV
 * @return {
 *   circonscription: the conscription concern by this result line
 *   results: all votes by party
 * }
 */
function parseVotes(str) {
  const elements = str.split(',');
  let results = [];
  let votes;
  for (let i = 1; i < elements.length; i++) {
    if ([i] % 2 !== 0) {
      votes = parseInt(elements[i]);
    } else {
      const partyCode = elements[i].trim();
      results.push(new Vote(partyCode, votes));
    }
  }
  return {
    circonscription: elements[0],
    results,
  };
}

/**
 * Associate code and label for each party
 */
const partyLabelByCode = {
  C: 'Conservative Party',
  L: 'Labour Party',
  UKIP: 'UKIP',
  LD: 'Liberal Democrats',
  G: 'Green Party',
  Ind: 'Independent',
  SNP: 'SNP',
};

/**
 * Represent the vote result of a party.
 */
class Vote {
  constructor(partyCode, votes) {
    this.party = partyLabelByCode[partyCode];
    this.votes = votes;
  }

  computePercent(totalVote) {
    const percent = (this.votes * 100) / totalVote;
    this.percentVote = Math.round(percent * 100) / 100 + ' %';
  }

  toResult() {
    return { party: this.party, vote: this.percentVote };
  }
}
