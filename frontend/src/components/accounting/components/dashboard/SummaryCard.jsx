import React from 'react';
import { Box, Grid, Typography, Divider, Stack, CircularProgress, Tooltip, Paper } from '@mui/material'; 

const SummaryCard = ({ title, tagColor, data, prefix, isLoading = false }) => {
  
  // Replace moneyFormatter with your actual currency formatting logic
  const moneyFormatter = ({ amount, currency_code }) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency_code 
    }).format(amount);
  }; 

  return (
    <Grid item xs={12} sm={6} md={12} lg={6}>
      <Paper elevation={3} sx={{ color: '#595959', fontSize: 13, minHeight: '106px', height: '100%' }}>
        <Box sx={{ textAlign: 'center', justifyContent: 'center', p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#22075e',
              fontSize: 'large',
              margin: '5px 0',
              textTransform: 'capitalize',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Divider sx={{ padding: 0, margin: 0 }} />
        <Box sx={{ p: 2 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={4} sx={{ textAlign: 'left' }}>
              <Typography sx={{ whiteSpace: 'nowrap' }}>
                {prefix}
              </Typography>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ height: '100%', mx: 2 }} />
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isLoading ? (
                <CircularProgress /> 
              ) : (
                <Tooltip title={data}>
                  <Typography
                    variant="body1"
                    sx={{
                      margin: '0 auto',
                      justifyContent: 'center',
                      maxWidth: '110px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {data ? moneyFormatter({ amount: data, currency_code: 'USD' }) : moneyFormatter({ amount: 0, currency_code: 'USD' })}
                  </Typography>
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default SummaryCard;