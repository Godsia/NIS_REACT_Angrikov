package com.traininganalysis.training;

import com.traininganalysis.user.User;
import com.traininganalysis.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    private final TrainingRepository trainingRepository;
    private final UserRepository userRepository;

    public TrainingService(TrainingRepository trainingRepository, UserRepository userRepository) {
        this.trainingRepository = trainingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TrainingResponse> findAllByUserId(Long userId) {
        return trainingRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(TrainingResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TrainingResponse getById(Long id, Long userId) {
        Training t = trainingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Training not found"));
        if (!t.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Training not found");
        }
        return TrainingResponse.from(t);
    }

    @Transactional
    public TrainingResponse create(Long userId, TrainingRequest request) {
        validateRequest(request);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Training t = new Training();
        t.setUser(user);
        mapRequestToEntity(request, t);
        t = trainingRepository.save(t);
        return TrainingResponse.from(t);
    }

    @Transactional
    public TrainingResponse update(Long id, Long userId, TrainingRequest request) {
        validateRequest(request);
        Training t = trainingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Training not found"));
        if (!t.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Training not found");
        }
        mapRequestToEntity(request, t);
        t = trainingRepository.save(t);
        return TrainingResponse.from(t);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        Training t = trainingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Training not found"));
        if (!t.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Training not found");
        }
        trainingRepository.delete(t);
    }

    private void validateRequest(TrainingRequest request) {
        if (request.getType() == TrainingType.POWER) {
            if (request.getWeightKg() == null && request.getQuantity() == null) {
                throw new IllegalArgumentException("For power training provide weightKg and/or quantity");
            }
        } else if (request.getType() == TrainingType.ENDURANCE) {
            if (request.getDistanceKm() == null && request.getDurationMinutes() == null) {
                throw new IllegalArgumentException("For endurance training provide distanceKm and/or durationMinutes");
            }
        }
    }

    private void mapRequestToEntity(TrainingRequest request, Training t) {
        t.setDate(request.getDate());
        t.setName(request.getName());
        t.setType(request.getType());
        t.setWeightKg(request.getWeightKg());
        t.setQuantity(request.getQuantity());
        t.setDistanceKm(request.getDistanceKm());
        t.setDurationMinutes(request.getDurationMinutes());
        t.setNote(request.getNote());
    }
}
