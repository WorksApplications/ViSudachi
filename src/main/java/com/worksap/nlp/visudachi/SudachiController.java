package com.worksap.nlp.visudachi;

import java.io.IOException;
import java.io.Serializable;

import com.worksap.nlp.sudachi.Dictionary;
import com.worksap.nlp.sudachi.DictionaryFactory;
import com.worksap.nlp.sudachi.Tokenizer;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
public class SudachiController {
    private Dictionary dictionary;
    
    public SudachiController() throws IOException {
        dictionary = new DictionaryFactory().create();
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
