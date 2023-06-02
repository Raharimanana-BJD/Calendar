function calculerCycle(dateRegles) {
    const dateReglesObj = new Date(dateRegles);
    const cycles = [];
    let currentDate = dateReglesObj;
  
    for (let i = 0; i < 12; i++) {
      const ovulation = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const debutFertilite = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000);
      const finFertilite = new Date(ovulation.getTime() + 4 * 24 * 60 * 60 * 1000);
  
      cycles.push({
        date: currentDate.toISOString().split("T")[0],
        ovulation: ovulation.toISOString().split("T")[0],
        debut_fertilite: debutFertilite.toISOString().split("T")[0],
        fin_fertilite: finFertilite.toISOString().split("T")[0],
      });
  
      currentDate = new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000);
    }
  
    return cycles;
  }
  