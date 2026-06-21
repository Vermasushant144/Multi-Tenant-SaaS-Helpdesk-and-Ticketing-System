# ==========================================
# Stage 1: Build React Frontend (Vite)
# ==========================================
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

# Copy package descriptors and install dependencies
COPY frontend-react/package*.json ./
RUN npm ci

# Copy frontend source and build static files
COPY frontend-react/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Spring Boot Backend
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Copy pom.xml and fetch dependencies for caching
COPY backend/helpdesk-backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code
COPY backend/helpdesk-backend/src ./src

# Copy built React frontend assets from Stage 1 into Spring Boot static resources
COPY --from=frontend-build /frontend/dist ./src/main/resources/static/

# Package backend application into a JAR file, skipping test runs for build speed
RUN mvn clean package -DskipTests

# ==========================================
# Stage 3: Run Application
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy packaged JAR file from build stage
COPY --from=backend-build /app/target/*.jar app.jar

# Expose port (default 8080)
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
