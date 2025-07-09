package com.autonews.AutonomousAINewsChannel.service;

import com.autonews.AutonomousAINewsChannel.model.Headline;
import com.autonews.AutonomousAINewsChannel.model.NewsItem;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Arrays;
import java.util.List;

@Service
public class NewsFetcherService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String pythonBaseUrl = "http://localhost:8000/news";

    public List<NewsItem> getLeftNews() {
        NewsItem[] news = restTemplate.getForObject(pythonBaseUrl + "/left", NewsItem[].class);
        return Arrays.asList(news);
    }

    public List<NewsItem> getRightNews() {
        NewsItem[] news = restTemplate.getForObject(pythonBaseUrl + "/right", NewsItem[].class);
        return Arrays.asList(news);
    }

    public List<Headline> getTopHeadlines() {
        Headline[] headlines = restTemplate.getForObject(pythonBaseUrl + "/top", Headline[].class);
        return Arrays.asList(headlines);
    }

    public List<Headline> getBottomHeadlines() {
        Headline[] headlines = restTemplate.getForObject(pythonBaseUrl + "/bottom", Headline[].class);
        return Arrays.asList(headlines);
    }
}
