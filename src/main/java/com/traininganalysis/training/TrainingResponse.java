package com.traininganalysis.training;

import java.time.LocalDate;

public class TrainingResponse {

    private Long id;
    private LocalDate date;
    private String name;
    private TrainingType type;
    private Double weightKg;
    private Integer quantity;
    private Double distanceKm;
    private Integer durationMinutes;
    private String note;

    public static TrainingResponse from(Training t) {
        TrainingResponse r = new TrainingResponse();
        r.setId(t.getId());
        r.setDate(t.getDate());
        r.setName(t.getName());
        r.setType(t.getType());
        r.setWeightKg(t.getWeightKg());
        r.setQuantity(t.getQuantity());
        r.setDistanceKm(t.getDistanceKm());
        r.setDurationMinutes(t.getDurationMinutes());
        r.setNote(t.getNote());
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
