import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { styles } from "./Calendar.style";
import { View } from "react-native";

function calculerCycle(dateRegles) {
  // Convertir la date des règles en objet de type Date
  const dateReglesObj = new Date(dateRegles);

  // Calculer la date approximative de l'ovulation
  const ovulation = new Date(dateReglesObj.getTime() + 14 * 24 * 60 * 60 * 1000);

  // Calculer la période de fécondité
  const debutFertilite = new Date(ovulation.getTime() - 4 * 24 * 60 * 60 * 1000);
  const finFertilite = new Date(ovulation.getTime() + 10 * 24 * 60 * 60 * 1000);

  // Calculer les dates des règles suivantes pour les 12 prochains mois
  const cycles = [];
  let currentDate = dateReglesObj;
  for (let i = 0; i < 12; i++) {
    cycles.push(currentDate.toISOString().split("T")[0]);
    currentDate = new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000);
  }

  return {
    ovulation: ovulation.toISOString().split("T")[0],
    debut_fertilite: debutFertilite.toISOString().split("T")[0],
    fin_fertilite: finFertilite.toISOString().split("T")[0],
    cycles: cycles,
    premier_jour_regles: dateReglesObj.toISOString().split("T")[0], // Ajout de la date du premier jour des règles
  };
}

export default function App() {
  const [selected, setSelected] = useState("");
  const [cycle, setCycle] = useState(null);

  const handlePressDay = (day) => {
    setSelected(day.dateString);
    const calculatedCycle = calculerCycle(day.dateString);
    setCycle(calculatedCycle); // Mettre à jour le state "cycle" avec les données de cycle calculées
  };

  const renderCustomDay = (day, selected, cycle) => {
    const formattedDay = day.dateString;
    const markedDates = {};

    if (formattedDay === selected) {
      markedDates[formattedDay] = { startingDay: true, color: "#FFADAD" };
    }

    if (cycle) {
      // Marquer les jours des règles (1 jusqu'au 5) en #FFADAD
      if (cycle.cycles.includes(formattedDay)) {
        markedDates[formattedDay] = { startingDay: true, color: "#FFADAD" };
        markedDates[new Date(formattedDay).getTime() + 4 * 24 * 60 * 60 * 1000] = { color: "#FFADAD" };
      }

      // Marquer la période de fécondité (9 jusqu'au 15) en #E2445C
      if (
        formattedDay >= cycle.debut_fertilite &&
        formattedDay <= cycle.fin_fertilite
      ) {
        markedDates[formattedDay] = { color: "#E2445C" };
      }

      // Marquer le jour d'ovulation (14) en #E2445C contour
      if (formattedDay === cycle.ovulation) {
        markedDates[formattedDay] = { color: "#E2445C", marked: true, dotColor: "#E2445C" };
      }

      // Marquer les cinq premiers jours de règles (29 jusqu'au 2) en #FFADAD
      const nextCycle = new Date(cycle.premier_jour_regles).getTime() + 28 * 24 * 60 * 60 * 1000;
      const nextCycleDay = new Date(nextCycle).toISOString().split("T")[0];
      if (
        formattedDay >= cycle.premier_jour_regles ||
        (formattedDay <= nextCycleDay && formattedDay >= nextCycleDay - 4 * 24 * 60 * 60 * 1000)
      ) {
        markedDates[formattedDay] = { startingDay: true, color: "#FFADAD" };
      }
    }

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.theme}
        onDayPress={handlePressDay}
        markingType="custom"
        markedDates={renderCustomDay(selected, cycle)}
      />
    </View>
  );
}
