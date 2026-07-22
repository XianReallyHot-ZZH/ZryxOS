package com.zryxos.core.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Session - 会话上下文容器
 *
 * @author ZryxOS Team
 */
@Data
public class Session {

    private String sessionId;
    private String profileName;
    private String channel;
    private String userId;
    private List<Message> messages = new ArrayList<>();
    private SessionStatus status = SessionStatus.ACTIVE;
    private LocalDateTime createdAt;
    private LocalDateTime lastActiveAt;
    private LocalDateTime archivedAt;

    public enum SessionStatus {
        ACTIVE, ARCHIVED
    }
}
