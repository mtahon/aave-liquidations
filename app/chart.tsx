"use client";
import * as React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const QUERY_URL = process.env.NEXT_PUBLIC_GRAPH_QUERY_URL || '/mock/graphql_data.json'

type Liquidation = {
  id: string;
  amountUSD: number;
  timestamp: number
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format;

const GRAPHQL_QUERY = `{
  liquidates(
    first:1000,
    orderBy:amountUSD,
    orderDirection:desc
  ) {
		id
    amountUSD
    timestamp
  }
}`;

export default function LiquidationChart() {
  const theme = useTheme();
  const newTheme = createTheme({ palette: { mode: theme.palette.mode } });

  const [dataSet, setDataSet] = React.useState<Liquidation[]>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const needsFetching = !dataSet && !error;

  React.useEffect(() => {
    if(needsFetching) {
      setLoading(true);
      fetch(QUERY_URL, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({query: GRAPHQL_QUERY}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if(!response.ok) {
            setError('http error ' + response.status);
          } else {
            response.json()
              .then(jsonData => {
                if(jsonData.errors) {
                  setError('error in json' + jsonData.errors[0].message);
                } else {
                  setDataSet(jsonData.data.liquidates);
                }
              })
              .catch(() => setError('invalid json'))
          }
        })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }
  }, [needsFetching]);

  return (
    <ThemeProvider theme={newTheme}>
      <p>{error}</p>
      <Paper sx={{ width: '100%', p: 0, marginTop: 10 }} elevation={0}>
        <ScatterChart
          sx={{ width: '100%' }}
          series={[
            {
              data: dataSet ? dataSet.map(v => ({
                id: v.id,
                x: v.timestamp,
                y: v.amountUSD
              })) : [],
              valueFormatter: v => currencyFormatter(v.y) + ' on ' + new Date(v.x * 1000).toLocaleDateString()
            }
          ]}
          xAxis={[{
            valueFormatter: (value) => new Date(value * 1000).toLocaleDateString(),
          }]}
          yAxis={[{
            scaleType: 'log'
          }]}
          //width={500}
          height={500}
          grid={{ vertical: true, horizontal: true }}
          loading={loading}
          
        />
      </Paper>
    </ThemeProvider>
  );
}