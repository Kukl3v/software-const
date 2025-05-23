FROM openjdk:17-jdk-slim-buster
ADD build/libs/server-0.0.1.jar /app/
CMD ["java", "-Xmx512m", "-jar", "-Dspring.profiles.active=prod", "/app/server-0.0.1.jar"]

EXPOSE 8080