package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.domain.Club;
import ru.kukl33v.server.dto.ClubDTO;
import ru.kukl33v.server.mapper.ClubMapper;
import ru.kukl33v.server.repository.ClubRepository;
import ru.kukl33v.server.validation.ValidatorUtil;
import ru.kukl33v.server.validation.exception.ClubNotFoundException;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClubService {

    ClubRepository clubRepository;
    ClubMapper clubMapper;
    ValidatorUtil validatorUtil;

    public List<ClubDTO> getClubList(Pageable pageable){
        Page<Club> clubs = clubRepository.findAll(pageable);
        return clubs.stream().map(clubMapper::toDTO).toList();
    }

    public ClubDTO findClub(UUID id) {
        return clubRepository.findById(id)
                .map(clubMapper::toDTO)
                .orElseThrow(() -> new ClubNotFoundException(id));
    }

    @Transactional
    public void createClub(ClubDTO clubDTO){
        Club club = clubMapper.toClub(clubDTO);
        validatorUtil.validate(club);
        clubRepository.save(club);
    }

    @Transactional
    public ClubDTO updateClub(ClubDTO clubDTO, UUID id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ClubNotFoundException(id));
        clubMapper.updateClubFromDTO(clubDTO, club);
        return clubMapper.toDTO(clubRepository.save(club));
    }

    @Transactional
    public void deleteClub(UUID id){
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ClubNotFoundException(id));
        clubRepository.delete(club);
    }

}
