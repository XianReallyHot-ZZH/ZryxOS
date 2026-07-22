package com.zryxos.core.model;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

/**
 * Profile - Agent 运行时配置
 *
 * @author ZryxOS Team
 */
@Data
public class Profile {

    private String name;
    private String description;

    private Identity identity;
    private ProviderConfig provider;
    private List<String> tools = new ArrayList<>();
    private List<String> skills = new ArrayList<>();
    private List<String> mcpServers = new ArrayList<>();
    private List<ChannelConfig> channels = new ArrayList<>();
    private List<NotifyChannelConfig> notifyChannels = new ArrayList<>();
    private List<String> bootstrap = new ArrayList<>();
    private Settings settings = new Settings();

    @Data
    public static class Identity {
        private String agentName;
        private String prompt;
    }

    @Data
    public static class ProviderConfig {
        private String name;
        private String model;
        private Float temperature;
    }

    @Data
    public static class ChannelConfig {
        private String name;
        private Object config;
    }

    @Data
    public static class NotifyChannelConfig {
        private String type;
        private String url;
    }

    @Data
    public static class Settings {
        private int maxIterations = 10;
        private int maxHistoryTurns = 20;
    }
}
