FROM amazoncorretto:21

WORKDIR /app

COPY target/*.jar app/Autodrive-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app/Autodrive-0.0.1-SNAPSHOT.jar"]