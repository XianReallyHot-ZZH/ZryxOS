package com.zryxos.core.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Message - 对话消息
 *
 * @author ZryxOS Team
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    private MessageRole role;
    private String content;
    private String toolCallId;
    private String toolName;

    public enum MessageRole {
        USER, ASSISTANT, SYSTEM, TOOL
    }
}
