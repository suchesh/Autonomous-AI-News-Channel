package com.autonews.AutonomousAINewsChannel.model;

public class NewsItem {
    private String title;
    private String description;
    private String category;

    public NewsItem(String title, String description, String category) {
        this.title = title;
        this.description = description;
        this.category = category;
    }

    public String getTitle() { return title; }
    public String getdescription() { return description; }
    public String getCategory() { return category; }
}
