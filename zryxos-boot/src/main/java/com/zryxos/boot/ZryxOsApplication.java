package com.zryxos.boot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ZryxOS Main Application
 *
 * @author ZryxOS Team
 */
@SpringBootApplication(scanBasePackages = "com.zryxos")
public class ZryxOsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ZryxOsApplication.class, args);
    }
}
