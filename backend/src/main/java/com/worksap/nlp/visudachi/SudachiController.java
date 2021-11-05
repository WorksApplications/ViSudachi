package com.worksap.nlp.visudachi;

import java.io.IOException;
import java.io.Serializable;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

import com.worksap.nlp.sudachi.Dictionary;
import com.worksap.nlp.sudachi.DictionaryFactory;
import com.worksap.nlp.sudachi.Tokenizer;

import org.springframework.boot.ApplicationArguments;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
public class SudachiController {
    @Resource
    private ApplicationArguments arguments;

    private Dictionary dictionary;

    @PostConstruct
    public void buildDictionary() throws IOException {
        List<String> systemDict = arguments.getOptionValues("system-dict");
        List<String> userDict = arguments.getOptionValues("user-dict");

        JsonObjectBuilder config = Json.createObjectBuilder();
        if (systemDict != null && !systemDict.isEmpty()) {
            config.add("systemDict", systemDict.get(systemDict.size() - 1));
        }
        if (userDict != null && !userDict.isEmpty()) {
            JsonArrayBuilder builder = Json.createArrayBuilder();
            userDict.forEach(builder::add);
            config.add("userDict", builder);
        }

        dictionary = new DictionaryFactory().create(null, config.build().toString(), true);
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
