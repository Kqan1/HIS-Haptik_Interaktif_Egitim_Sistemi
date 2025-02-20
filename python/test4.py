import smbus

# Initialize I2C bus (bus 1 on the RPi3B+)
bus = smbus.SMBus(1)

# Global state for each PCF8574P device (all bits high = inactive)
chip_state = {
    0x24: 0xFF,  # Supply side: supply pins 0-7
    0x26: 0xFF,  # Supply side: supply pins 8-15
    0x25: 0xFF,  # Shared chip: supply pins 16-17 (p0-p1) & drain pins 0-5 (p2-p7)
    0x22: 0xFF,  # Drain side: drain pins 7-14
    0x27: 0xFF,  # Drain side: drain pins 15-18
}

def get_supply_mapping(supplypin):
    """
    Map a supply pin number to its corresponding I2C address and bit mask.
    
    Supply mapping:
      - Pins 0 to 7   : Address 0x24, bit positions 0-7.
      - Pins 8 to 15  : Address 0x26, bit positions 0-7.
      - Pins 16 and 17: Address 0x25, bit positions 0 and 1.
    """
    if 0 <= supplypin <= 7:
        addr = 0x24
        bit = supplypin  # p0 to p7
    elif 8 <= supplypin <= 15:
        addr = 0x26
        bit = supplypin - 8  # p0 to p7
    elif supplypin in [16, 17]:
        addr = 0x25
        bit = supplypin - 16  # p0 for 16, p1 for 17
    else:
        raise ValueError("Invalid supply pin number")
    return addr, (1 << bit)

def get_drain_mapping(drainpin):
    """
    Map a drain pin number to its corresponding I2C address and bit mask.
    
    Drain mapping:
      - For drain pins 0 to 5: Use chip 0x25, bits p2 to p7.
         (Logical drain 0 -> p2, …, drain 5 -> p7)
      - For drain pins 7 to 14: Use chip 0x22, bits p0 to p7.
         (Drain 7 -> p0, …, drain 14 -> p7)
      - For drain pins 15 to 18: Use chip 0x27, bits p0 to p3.
         (Drain 15 -> p0, etc.)
    """
    if 0 <= drainpin <= 5:
        addr = 0x25
        bit = drainpin + 2  # p2 corresponds to drain 0, so on up to p7 for drain 5
    elif 7 <= drainpin <= 14:
        addr = 0x22
        bit = drainpin - 7  # drain 7 -> p0, drain 14 -> p7
    elif 15 <= drainpin <= 18:
        addr = 0x27
        bit = drainpin - 15  # drain 15 -> p0, etc.
    else:
        raise ValueError("Invalid drain pin number")
    return addr, (1 << bit)

def PtEnable(supplypin, drainpin):
    """
    Enable the specified point in the matrix by driving the
    corresponding supply and drain pins low.
    """
    # Enable supply pin (active low)
    addr, mask = get_supply_mapping(supplypin)
    global chip_state
    chip_state[addr] &= ~mask  # Clear the bit to enable
    bus.write_byte(addr, chip_state[addr])
    
    # Enable drain pin (active low)
    addr, mask = get_drain_mapping(drainpin)
    chip_state[addr] &= ~mask
    bus.write_byte(addr, chip_state[addr])

def PtDisable(supplypin, drainpin):
    """
    Disable the specified point in the matrix by releasing
    the corresponding supply and drain pins (set high).
    """
    # Disable supply pin (set high)
    addr, mask = get_supply_mapping(supplypin)
    global chip_state
    chip_state[addr] |= mask  # Set the bit to disable
    bus.write_byte(addr, chip_state[addr])
    
    # Disable drain pin (set high)
    addr, mask = get_drain_mapping(drainpin)
    chip_state[addr] |= mask
    bus.write_byte(addr, chip_state[addr])

# Example usage:
if __name__ == "__main__":
    # Example: Enable supply pin 3 and drain pin 10
    PtEnable(3, 10)
    # ... do work ...
    # Then disable them
    PtDisable(3, 10)