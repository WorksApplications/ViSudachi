# ViSudachi
A tool for visualizing the internal structures of morphological analyzer Sudachi.

## Build

```
./gradlew build
./gradlew bootJar
```

## Usage

1. Copy `system_core.dic` to the current directory.
2. Launch the process and browse to `http://localhost:8080` in your web browser.

```
java -jar build/libs/visudachi-0.0.1-SNAPSHOT.jar
```

Or, if you want to specify dictionaries, you can do so as follows.

```
java -jar build/libs/visudachi-0.0.1-SNAPSHOT.jar --system-dict=/path/to/system_core.dic --user-dict=/path/to/user.dic --user-dict=/path/to/user2.dic
```

The optimal path containing the selected nodes will be displayed in dark green and the cost will be displayed in `total cost`. The default is the output path of Sudachi. If another path is selected, the Sudachi path will be shown in yellow and the cost difference will be displayed in parentheses.


![screenshot](https://github.com/WorksApplications/ViSudachi/blob/images/screenshot.png)

## Thanks

This tool was inspired by ViJUMAN, ViCha and VisualMorphs.
