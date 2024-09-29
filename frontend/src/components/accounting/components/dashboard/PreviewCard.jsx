import { Box, CircularProgress, Grid, LinearProgress, Typography } from '@mui/material';
import React, { useMemo } from 'react';

const colours = {
  draft: '#595959',
  sent: '#1890ff',
  pending: '#1890ff',
  unpaid: '#ffa940',
  overdue: '#ff4d4f',
  partially: '#13c2c2',
  paid: '#95de64',
  declined: '#ff4d4f',
  accepted: '#95de64',
  cyan: '#13c2c2',
  purple: '#722ed1',
  expired: '#614700',
};

const defaultStatistics = [
  {
    tag: 'draft',
    value: 0,
  },
  {
    tag: 'pending',
    value: 0,
  },
  {
    tag: 'sent',
    value: 0,
  },
  {
    tag: 'accepted',
    value: 0,
  },
  {
    tag: 'declined',
    value: 0,
  },
  {
    tag: 'expired',
    value: 0,
  },
];

const defaultInvoiceStatistics = [
  {
    tag: 'draft',
    value: 0,
  },
  {
    tag: 'pending',
    value: 0,
  },
  {
    tag: 'overdue',
    value: 0,
  },
  {
    tag: 'paid',
    value: 0,
  },
  {
    tag: 'unpaid',
    value: 0,
  },
  {
    tag: 'partially',
    value: 0,
  },
];

const PreviewState = ({ tag, color, value }) => (
  <Box sx={{ color: '#595959', mb: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{tag}</Typography> 
      <Typography variant="body2" align="right">{value}%</Typography>
    </Box>
    <LinearProgress variant="determinate" value={value} sx={{ backgroundColor: color }} /> 
  </Box>
);

const PreviewCard = ({ title = 'Preview', statistics = defaultStatistics, isLoading = false, entity = 'invoice' }) => {
  const statisticsMap = useMemo(() => {
    if (entity === 'invoice') {
      return defaultInvoiceStatistics.map((defaultStat) => {
        const matchedStat = Array.isArray(statistics)
          ? statistics.find((stat) => stat.tag === defaultStat.tag)
          : null;
        return matchedStat || defaultStat;
      });
    } else {
      return defaultStatistics.map((defaultStat) => {
        const matchedStat = Array.isArray(statistics)
          ? statistics.find((stat) => stat.tag === defaultStat.tag)
          : null;
        return matchedStat || defaultStat;
      });
    }
  }, [statistics, entity]);

  const customSort = (a, b) => {
    const colorOrder = Object.values(colours);
    const indexA = colorOrder.indexOf(a.props.color);
    const indexB = colorOrder.indexOf(b.props.color);
    return indexA - indexB;
  };

  return (
    <Grid item xs={12} sm={24} md={8} lg={8}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: '#22075e', fontSize: 'large', mb: 4, mt: 0 }}>
          {title}
        </Typography>
        {isLoading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress /> 
          </Box>
        ) : (
          statisticsMap
            .map((status, index) => (
              <PreviewState 
                key={index}
                tag={status.tag}
                color={colours[status.tag]} 
                value={status?.value}
              />
            ))
            .sort(customSort) 
        )}
      </Box>
    </Grid>
  );
};

export default PreviewCard;