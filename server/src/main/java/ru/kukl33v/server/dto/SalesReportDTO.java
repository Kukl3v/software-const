package ru.kukl33v.server.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SalesReportDTO {
    private LocalDate period;
    private Long subscriptionCount;
    private BigDecimal totalRevenue;

    public SalesReportDTO(LocalDate period, Long subscriptionCount, BigDecimal totalRevenue) {
        this.period = period;
        this.subscriptionCount = subscriptionCount;
        this.totalRevenue = totalRevenue;
    }

    public LocalDate  getPeriod() {
        return period;
    }

    public void setPeriod(LocalDate period) {
        this.period = period;
    }
    public Long getSubscriptionCount() {
        return subscriptionCount;
    }

    public void setSubscriptionCount(Long subscriptionCount) {
        this.subscriptionCount = subscriptionCount;
    }
    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
