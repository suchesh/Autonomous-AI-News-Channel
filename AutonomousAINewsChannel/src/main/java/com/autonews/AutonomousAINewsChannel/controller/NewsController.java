package com.autonews.AutonomousAINewsChannel.controller;

import com.autonews.AutonomousAINewsChannel.model.Headline;
import com.autonews.AutonomousAINewsChannel.model.NewsItem;
import com.autonews.AutonomousAINewsChannel.service.NewsFetcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsFetcherService newsFetcherService;

    @GetMapping("/left")
    public List<NewsItem> getLeftNews() {
        return newsFetcherService.getLeftNews();
    }

    @GetMapping("/right")
    public List<NewsItem> getRightNews() {
        return newsFetcherService.getRightNews();
    }

    @GetMapping("/top")
    public List<Headline> getTopHeadline() {
        return newsFetcherService.getTopHeadlines();
    }

    @GetMapping("/bottom")
    public List<Headline> getBottomNews() {
        return newsFetcherService.getBottomHeadlines();
    }
}
