package com.traininganalysis.training;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Тип тренировки: POWER — силовая (кг + кол-во раз), ENDURANCE — выносливость (км + минуты)")
public enum TrainingType {
    @Schema(description = "Силовая: weightKg, quantity")
    POWER,
    @Schema(description = "Выносливость: distanceKm, durationMinutes")
    ENDURANCE
}
