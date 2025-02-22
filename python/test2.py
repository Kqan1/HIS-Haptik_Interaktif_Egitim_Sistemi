import smbus
import time

bus = smbus.SMBus(1)

chip_state = {
    0x24: 0xFF,
    0x26: 0xFF,
    0x25: 0xFF,
    0x22: 0xFF,
    0x27: 0xFF,
}

def get_supply_mapping(supplypin):
    if 0 <= supplypin <= 7:
        addr = 0x24
        bit = supplypin
    elif 8 <= supplypin <= 15:
        addr = 0x26
        bit = supplypin - 8
    elif supplypin in [16, 17]:
        addr = 0x25
        bit = supplypin - 16
    else:
        raise ValueError(f"Invalid supply pin: {supplypin}")
    return addr, (1 << bit)

def get_drain_mapping(drainpin):
    if 0 <= drainpin <= 5:
        addr = 0x25
        bit = drainpin + 2
    elif 7 <= drainpin <= 14:
        addr = 0x22
        bit = drainpin - 7
    elif 15 <= drainpin <= 18:
        addr = 0x27
        bit = drainpin - 15
    else:
        raise ValueError(f"Invalid drain pin: {drainpin}")
    return addr, (1 << bit)

def PtEnable(supplypin, drainpin):
    global chip_state

    s_addr, s_mask = get_supply_mapping(supplypin)
    chip_state[s_addr] &= ~s_mask
    print(f"Enabling Supply: {supplypin} -> Addr {hex(s_addr)}, Mask {bin(s_mask)}")
    bus.write_byte(s_addr, chip_state[s_addr])

    d_addr, d_mask = get_drain_mapping(drainpin)
    chip_state[d_addr] &= ~d_mask
    print(f"Enabling Drain: {drainpin} -> Addr {hex(d_addr)}, Mask {bin(d_mask)}")
    bus.write_byte(d_addr, chip_state[d_addr])

def PtDisable(supplypin, drainpin):
    global chip_state

    s_addr, s_mask = get_supply_mapping(supplypin)
    chip_state[s_addr] |= s_mask
    print(f"Disabling Supply: {supplypin} -> Addr {hex(s_addr)}, Mask {bin(s_mask)}")
    bus.write_byte(s_addr, chip_state[s_addr])

    d_addr, d_mask = get_drain_mapping(drainpin)
    chip_state[d_addr] |= d_mask
    print(f"Disabling Drain: {drainpin} -> Addr {hex(d_addr)}, Mask {bin(d_mask)}")
    bus.write_byte(d_addr, chip_state[d_addr])

if __name__ == "__main__":
    while True:
        PtEnable(3, 10)
        time.sleep(2)
        PtDisable(3, 10)
        time.sleep(2)
