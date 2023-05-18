import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Paper,
  LinearProgress,
} from "@mui/material";

const CountdownTimer = () => {
  // Definimos dos estados con hooks de useState: endDateTime y timeRemaining
  // endDateTime es un objeto Date que representa el momento en el que el contador terminará
  // timeRemaining es un objeto que representa el tiempo restante en horas, minutos y segundos
  const [endDateTime, setEndDateTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Esta función maneja el cambio de la fecha final
  const handleEndDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = new Date(e.target.value);
    setEndDateTime(newDateTime);
    setTimeRemaining(null);
  };

  // Esta función maneja el inicio del temporizador
  const handleStartTimer = () => {
    const startTime = new Date();
    const endTime = endDateTime;
    const timeRemainingInMilliseconds = endTime.getTime() - startTime.getTime();

    // Convertimos el tiempo restante de milisegundos a horas, minutos y segundos
    setTimeRemaining({
      hours: Math.floor(timeRemainingInMilliseconds / (1000 * 60 * 60)),
      minutes: Math.floor(
        (timeRemainingInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      ),
      seconds: Math.floor((timeRemainingInMilliseconds % (1000 * 60)) / 1000),
    });
  };

  // Esta función maneja el reinicio del temporizador
  const handleResetTimer = () => {
    setEndDateTime(new Date());
    setTimeRemaining(null);
  };

  return (
    <Paper>
      <Typography variant="h4">Countdown Timer</Typography>
      <TextField
        label="End Date"
        type="date"
        onChange={handleEndDateTimeChange}
      />
      <Button variant="contained" onClick={handleStartTimer}>
        Start Timer
      </Button>
      {/* Mostramos una barra de progreso si hay un tiempo restante definido */}
      {timeRemaining && <LinearProgress value={timeRemaining.hours} />}
      {/* Mostramos el tiempo restante en horas, minutos y segundos */}
      <Typography variant="h6">
        Time Remaining: {timeRemaining?.hours}h {timeRemaining?.minutes}m{" "}
        {timeRemaining?.seconds}s
      </Typography>
      <Button variant="contained" onClick={handleResetTimer}>
        Reset Timer
      </Button>
    </Paper>
  );
};

export default CountdownTimer;
