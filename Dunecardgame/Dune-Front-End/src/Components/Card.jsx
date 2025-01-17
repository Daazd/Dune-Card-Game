import React from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography, Box } from '@mui/material';

const Card = ({ name, faction, attack, defense, abilities, image, onClick, selected }) => {
  return (
    <Box onClick={onClick} sx={{ border: selected ? '2px solid blue' : 'none', margin: 2 }}>
      <MuiCard sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Faction:</strong> {faction}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Attack:</strong> {attack} <strong>Defense:</strong> {defense}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Abilities:</strong>
            <ul>
              {abilities.map((ability, index) => (
                <li key={index}>{ability}</li>
              ))}
            </ul>
          </Typography>
        </CardContent>
      </MuiCard>
    </Box>
  );
};

export default Card;
