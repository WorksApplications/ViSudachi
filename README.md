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

The optimal path containing the selected node will be displayed in dark green and the cost will be displayed in `total cost`. The default is the output path of Sudachi. If another path is selected, the Sudachi path will be shown in yellow and the cost difference will be displayed in parentheses.


![screenshot](https://github.com/WorksApplications/ViSudachi/blob/images/screenshot.png)

## Todo

- Specify the location of dictionaries
- Specify system dictionary type and user dictionaries

## Thanks

This tool was inspired by ViJUMAN, ViCha and VisualMorphs.
