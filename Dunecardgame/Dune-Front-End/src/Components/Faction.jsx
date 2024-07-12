import React from 'react';
import { Box, Typography } from '@mui/material';
import Card from './Card';

const Faction = ({ factionName, cards }) => {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h4" component="div" sx={{ textAlign: 'center', marginBottom: 2 }}>
        {factionName}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </Box>
    </Box>
  );
};

export default Faction;
