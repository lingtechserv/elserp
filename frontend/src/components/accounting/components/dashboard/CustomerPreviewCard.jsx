import React from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@mui/icons-material";

function CustomerPreviewCard({ isLoading, activeCustomer, newCustomer }) {
  return (
    <Grid container justifyContent="center">
      <Box
        sx={{
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          height: 458,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: "#22075e",
            mb: 4,
            fontSize: "large",
          }}
        >
          Customers
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Grid container direction="column" alignItems="center">
            <CircularProgress
              variant="determinate"
              value={newCustomer}
              size={148}
            />
            <Typography variant="body1">New Customers this Month</Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" alignItems="center">
              {activeCustomer > 0 ? (
                <ArrowUpwardIcon color="success" />
              ) : activeCustomer < 0 ? (
                <ArrowDownwardIcon color="error" />
              ) : null}
              <Typography variant="h6" sx={{ mx: 1 }}>
                {activeCustomer}%
              </Typography>
            </Stack>
            <Typography variant="body1">Active Customers</Typography>
          </Grid>
        )}
      </Box>
    </Grid>
  );
}

export default CustomerPreviewCard;
