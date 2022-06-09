package com.worksap.nlp.visudachi;

import com.worksap.nlp.sudachi.Config;
import com.worksap.nlp.sudachi.Dictionary;
import com.worksap.nlp.sudachi.DictionaryFactory;
import com.worksap.nlp.sudachi.Tokenizer;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@Slf4j
public class SudachiController {
    @Resource
    private ApplicationArguments arguments;

    private Dictionary dictionary;

    @PostConstruct
    public void buildDictionary() throws IOException {
        List<String> systemDict = arguments.getOptionValues("system-dict");
        List<String> userDict = arguments.getOptionValues("user-dict");
        List<String> config = arguments.getOptionValues("sudachi-conf");

        Config cfg = Config.empty();

        if (config != null) {
            for (int i = config.size() - 1; i >= 0; i--) {
                String configLocation = config.get(i);
                cfg = cfg.withFallback(Config.fromFile(Paths.get(configLocation)));
                log.info("using configuration file {}", configLocation);
            }
        }

        if (systemDict != null && !systemDict.isEmpty()) {
            Path path = Paths.get(systemDict.get(systemDict.size() - 1));
            cfg.systemDictionary(path);
            log.info("using system dictionary: {}", path);
        }

        if (userDict != null && !userDict.isEmpty()) {
            for (String udic: userDict) {
                cfg.addUserDictionary(Paths.get(udic));
                log.info("using user dictionary: {}", userDict);
            }
        }

        cfg = cfg.withFallback(Config.fromClasspath());

        dictionary = new DictionaryFactory().create(cfg);
    }

    @Data
    public static class TextParam implements Serializable {
        private String text;
    }

    @PostMapping(value = "/dump", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String dump(@RequestBody TextParam param) {
        Tokenizer tokenizer = dictionary.create();
        return tokenizer.dumpInternalStructures(param.getText());
    }
}
