import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import './FlippableCard.css';

const FlippableCard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const cleanData = (data) => {
    return data === "NaN" ? "" : data;
  };

  return (
    <Box className={`flippable-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <Box className="flippable-card-inner">
        <Card className="flippable-card-front">
          <CardMedia
            component="img"
            height="100%"
            image={`http://localhost:8000/media/dune_card_images/${card.image_file}`}
            alt={card.name}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Card>
        <Card className="flippable-card-back">
          <CardContent>
            <Typography variant="h5" component="div">
              {card.name}
            </Typography>
            <Typography variant="body2" color="text.secondary"><strong>Errata:</strong> {cleanData(card.errata)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Set:</strong> {cleanData(card.set)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Rarity:</strong> {cleanData(card.rarity)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Deck:</strong> {cleanData(card.deck)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Cost:</strong> {cleanData(card.cost)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Allegiance:</strong> {cleanData(card.allegiance)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Talent Req:</strong> {cleanData(card.talent_req)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Type:</strong> {cleanData(card.type)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Subtype 1:</strong> {cleanData(card.subtype1)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Subtype 2:</strong> {cleanData(card.subtype2)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Subtype 3:</strong> {cleanData(card.subtype3)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Subtype 4:</strong> {cleanData(card.subtype4)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Talent 1:</strong> {cleanData(card.talent1)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Talent 2:</strong> {cleanData(card.talent2)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Talent 3:</strong> {cleanData(card.talent3)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Command:</strong> {cleanData(card.command)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Resistance:</strong> {cleanData(card.resistance)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Operation Text:</strong> {cleanData(card.operation_text)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Flavor Text:</strong> {cleanData(card.flavor_text)}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Artist:</strong> {cleanData(card.artist)}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default FlippableCard;


