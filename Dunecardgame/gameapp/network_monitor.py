from scapy.all import sniff, IP
from collections import defaultdict
import time

class NetworkMonitor:
    def __init__(self):
        self.ip_counts = defaultdict(int)
        self.suspicious_ips = set()
        
    def packet_callback(self, packet):
        if IP in packet:
            # Track source IPs
            src_ip = packet[IP].src
            self.ip_counts[src_ip] += 1
            
            # Check for suspicious activity
            if self.ip_counts[src_ip] > 100:  # Threshold for demo
                self.suspicious_ips.add(src_ip)
                print(f"Suspicious traffic detected from {src_ip}")

    def start_monitoring(self):
        print("Starting network monitoring...")
        # Monitor only traffic to your application port
        sniff(filter="port 8000", prn=self.packet_callback, store=0)