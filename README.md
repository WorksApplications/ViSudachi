# ViSudachi
A tool for visualizing the internal structures of morphological analyzer Sudachi.

## Build

```
./gradlew bootJar
```

(Need Sudachi 0.5.3-SNAPSHOT or later)

## Usage

1. Copy `system_core.dic` to the current directory.
2. Launch the process and browse to `http://localhost:8080` in your web browser.

```
java -jar build/libs/visudachi-0.0.1-SNAPSHOT.jar
```

![screenshot](https://github.com/WorksApplications/ViSudachi/blob/images/screenshot.png)

## Todo

- Specify the location of dictionaries
- Specify system dictionary type and user dictionaries
