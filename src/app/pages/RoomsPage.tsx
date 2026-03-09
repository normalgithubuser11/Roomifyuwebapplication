import React, { useState } from 'react';
import { RoomCard } from '../components/RoomCard';
import { rooms, buildings, roomTypes, allFacilities } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Search, SlidersHorizontal, X, Home } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';

export function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [capacityRange, setCapacityRange] = useState([0]);
  const [favoriteRooms, setFavoriteRooms] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const maxCapacity = Math.max(...rooms.map(r => r.capacity));

  const handleTypeToggle = (type: string) => {
    setSelectedType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities(prev =>
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const handleFavorite = (roomId: string) => {
    setFavoriteRooms(prev =>
      prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBuilding('All Buildings');
    setSelectedType([]);
    setSelectedFacilities([]);
    setCapacityRange([0]);
  };

  const filteredRooms = rooms.filter(room => {
    // Search query
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.building.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Building filter
    if (selectedBuilding !== 'All Buildings' && room.building !== selectedBuilding) {
      return false;
    }

    // Type filter
    if (selectedType.length > 0 && !selectedType.includes(room.type)) {
      return false;
    }

    // Facilities filter
    if (selectedFacilities.length > 0) {
      const hasAllFacilities = selectedFacilities.every(f => room.facilities.includes(f));
      if (!hasAllFacilities) return false;
    }

    // Capacity filter
    if (capacityRange[0] > 0 && room.capacity < capacityRange[0]) {
      return false;
    }

    return true;
  });

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Building Filter */}
      <div className="space-y-2">
        <Label>Building</Label>
        <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {buildings.map(building => (
              <SelectItem key={building} value={building}>
                {building}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Capacity Filter */}
      <div className="space-y-2">
        <Label>Minimum Capacity: {capacityRange[0]}</Label>
        <Slider
          value={capacityRange}
          onValueChange={setCapacityRange}
          max={maxCapacity}
          step={5}
          className="mt-2"
        />
      </div>

      {/* Room Type Filter */}
      <div className="space-y-2">
        <Label>Room Type</Label>
        <div className="space-y-2">
          {roomTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedType.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm cursor-pointer capitalize"
              >
                {type.replace('-', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities Filter */}
      <div className="space-y-2">
        <Label>Facilities</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allFacilities.map(facility => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={`facility-${facility}`}
                checked={selectedFacilities.includes(facility)}
                onCheckedChange={() => handleFacilityToggle(facility)}
              />
              <label
                htmlFor={`facility-${facility}`}
                className="text-sm cursor-pointer"
              >
                {facility}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Find Rooms</h1>
        <p className="text-muted-foreground">
          Search and filter available rooms for your booking needs
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room name or building..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Mobile Filter Button */}
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterPanel />
            </CardContent>
          </Card>
        </aside>

        {/* Room Grid */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
            </p>
          </div>

          {filteredRooms.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No rooms found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onFavorite={handleFavorite}
                  isFavorite={favoriteRooms.includes(room.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
