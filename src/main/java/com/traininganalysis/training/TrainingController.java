package com.traininganalysis.training;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Тренировки", description = "CRUD тренировок: силовая (POWER — кг + кол-во раз), выносливость (ENDURANCE — км + минуты). Есть название (name) и заметка (note).")
@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @Operation(summary = "Список моих тренировок", description = "Все тренировки пользователя, от новых к старым.")
    @GetMapping
    public List<TrainingResponse> list(@AuthenticationPrincipal Long userId) {
        return trainingService.findAllByUserId(userId);
    }

    @Operation(summary = "Получить тренировку по id")
    @GetMapping("/{id}")
    public TrainingResponse get(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        return trainingService.getById(id, userId);
    }

    @Operation(summary = "Создать тренировку", description = "POWER: weightKg и/или quantity. ENDURANCE: distanceKm и/или durationMinutes. name и note — по желанию.")
    @PostMapping
    public ResponseEntity<TrainingResponse> create(
            @Valid @RequestBody TrainingRequest request,
            @AuthenticationPrincipal Long userId) {
        TrainingResponse created = trainingService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Обновить тренировку")
    @PutMapping("/{id}")
    public TrainingResponse update(
            @PathVariable Long id,
            @Valid @RequestBody TrainingRequest request,
            @AuthenticationPrincipal Long userId) {
        return trainingService.update(id, userId, request);
    }

    @Operation(summary = "Удалить тренировку")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Long userId) {
        trainingService.delete(id, userId);
    }
}
