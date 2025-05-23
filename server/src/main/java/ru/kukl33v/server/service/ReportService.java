package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.dto.SalesReportDTO;
import ru.kukl33v.server.repository.UserMembershipRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class ReportService {
    UserMembershipRepository userMembershipRepository;

    public List<SalesReportDTO> getSalesReport(LocalDate startDate, LocalDate endDate) {
        return userMembershipRepository.salesByPeriod(startDate, endDate).stream()
                .map(row -> new SalesReportDTO(
                        (LocalDate)   row[0],
                        (Long)        row[1],
                        (BigDecimal)  row[2]
                ))
                .collect(Collectors.toList());
    }
}
