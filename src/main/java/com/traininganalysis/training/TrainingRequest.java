package com.traininganalysis.training;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

@Schema(description = "Запрос на создание/обновление тренировки. POWER: weightKg, quantity. ENDURANCE: distanceKm, durationMinutes.")
public class TrainingRequest {

    @NotNull(message = "Date is required")
    @Schema(description = "Дата тренировки", example = "2025-03-08", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate date;

    @Schema(description = "Название тренировки", example = "Жим лёжа")
    private String name;

    @NotNull(message = "Type is required")
    @Schema(description = "Тип: POWER (силовая — кг + кол-во раз) или ENDURANCE (выносливость — км + минуты)", requiredMode = Schema.RequiredMode.REQUIRED)
    private TrainingType type;

    @PositiveOrZero
    @Schema(description = "Для POWER: вес в кг", example = "80")
    private Double weightKg;

    @PositiveOrZero
    @Schema(description = "Для POWER: количество раз (повторения)", example = "10")
    private Integer quantity;

    @PositiveOrZero
    @Schema(description = "Для ENDURANCE: километраж", example = "5.5")
    private Double distanceKm;

    @PositiveOrZero
    @Schema(description = "Для ENDURANCE: длительность в минутах", example = "32")
    private Integer durationMinutes;

    @Schema(description = "Заметка", example = "3 подхода")
    private String note;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TrainingType getType() {
        return type;
    }

    public void setType(TrainingType type) {
        this.type = type;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
